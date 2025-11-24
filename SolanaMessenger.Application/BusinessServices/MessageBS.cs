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
        private readonly ChatSettings _chatSettings;

        public MessageBS(
            IMapper mapper,
            IMessageRepository messageRep,
            IBlockchainRepository<MessageData> blockchainMessageRep,
            IOptions<ChatSettings> chatOpts,
            IChatRepository chatRep)
        {
            _mapper = mapper;
            _messageRep = messageRep;
            _chatSettings = chatOpts.Value;
            _messageBlockchainRep = blockchainMessageRep;
            _chatRep = chatRep;
        }

        public async Task<List<MessageDTO>> LoadChatMessages(Guid chatID, long? lastMessageTimestamp = null)
        {
            var messages = await _messageRep.GetMessagesAsync(chatID, _chatSettings.MessagesPerRequest, lastMessageTimestamp);
            return _mapper.Map<List<MessageDTO>>(messages);
        }

        public async Task<OpRes<MessageDTO>> WriteMessage(WriteMessageDTO dto, Guid userID)
        {
            var validResult = await _chatRep.IsUserAChatMemberAsync(dto.ChatID, userID);
            if (!validResult) return OpRes.Err<MessageDTO>("User is not a chat member");

            var messageID = Guid.NewGuid();

            var messageData = _mapper.Map<MessageData>(dto);
            messageData.ID = messageID;
            messageData.UserID = userID;

            var signatures = await _messageBlockchainRep.WriteObjectAsync(messageData);
            if (signatures == null)
                return OpRes.Err<MessageDTO>();

            var message = new Message()
            {
                ID = messageID,
                ChatID = dto.ChatID,
                Signatures = signatures
            };
            await _messageRep.AddAsync(message);
            await _messageRep.SaveChangesAsync();

            return OpRes.Success(_mapper.Map<MessageDTO>(messageData));
        }
    }
}
