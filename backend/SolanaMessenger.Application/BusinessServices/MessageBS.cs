using AutoMapper;
using Microsoft.Extensions.Options;
using SolanaMessenger.Application.DTOs;
using SolanaMessenger.Domain.Entities;
using SolanaMessenger.Infrastructure;
using SolanaMessenger.Infrastructure.Blockchain;

namespace SolanaMessenger.Application.BusinessServices
{
    public class MessageBS : IMessageBS
    {
        private readonly IMapper _mapper;
        private readonly IChatRepository _chatRep;
        private readonly IMessageRepository _messageRep;
        private readonly IBlockchainRepository<MessageData> _messageBlockchainRep;
        private readonly INewMessageNotificator _newMessageNotificator;
        private readonly ChatSettings _chatSettings;

        public MessageBS(
            IMapper mapper,
            IMessageRepository messageRep,
            IBlockchainRepository<MessageData> blockchainMessageRep,
            IOptions<ChatSettings> chatOpts,
            IChatRepository chatRep,
            INewMessageNotificator newMessageNotificator)
        {
            _mapper = mapper;
            _messageRep = messageRep;
            _chatSettings = chatOpts.Value;
            _messageBlockchainRep = blockchainMessageRep;
            _chatRep = chatRep;
            _newMessageNotificator = newMessageNotificator;
        }

        public async Task<OpRes<List<MessageDTO>>> LoadChatMessagesAsync(Guid chatID, Guid userID, long lastMessageTimestamp = 0)
        {
            var validResult = await _chatRep.IsUserAChatMemberAsync(chatID, userID);
            if (!validResult) return OpRes.Err<List<MessageDTO>>("User is not a chat member");

            var messages = await _messageRep.GetMessagesAsync(chatID, _chatSettings.MessagesPerRequest, lastMessageTimestamp);
            var tasks = messages.Select(m => _messageBlockchainRep.GetObjectAsync(m.Signatures));

            var messageData = await Task.WhenAll(tasks);
            messageData = messageData.Where(m => m != null).ToArray();
            var messageDTOs = _mapper.Map<List<MessageDTO>>(messageData);
            return OpRes.Success(messageDTOs);
        }

        public async Task<OpRes<Guid>> WriteMessageAsync(WriteMessageDTO dto, Guid userID)
        {
            var validResult = await _chatRep.IsUserAChatMemberAsync(dto.ChatID, userID);
            if (!validResult) return OpRes.Err<Guid>("User is not a chat member");

            var messageID = Guid.NewGuid();
            var timestamp = LinuxTimeStamp.UtcNow;

            var messageData = _mapper.Map<MessageData>(dto);
            messageData.ID = messageID;
            messageData.UserID = userID;
            messageData.Timestamp = timestamp;

            var signatures = await _messageBlockchainRep.WriteObjectAsync(messageData);
            if (signatures == null)
                return OpRes.Err<Guid>();

            var message = new Message()
            {
                ID = messageID,
                ChatID = dto.ChatID,
                Timestamp = timestamp,
                Signatures = signatures
            };
            await _messageRep.AddAsync(message);
            await _messageRep.SaveChangesAsync();

            _newMessageNotificator.Notify(_mapper.Map<MessageDTO>(messageData));

            return OpRes.Success(messageID);
        }
    }
}
