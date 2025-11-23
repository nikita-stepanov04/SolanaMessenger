using AutoMapper;
using Microsoft.Extensions.Options;
using SolanaMessenger.Application.DTOs;
using SolanaMessenger.Infrastructure;

namespace SolanaMessenger.Application.BusinessServices
{
    public class MessageBS : IMessageBS
    {
        private readonly IMapper _mapper;
        private readonly IMessageRepository _messageRep;
        private readonly ChatSettings _chatSettings;

        public MessageBS(
            IMapper mapper,
            IMessageRepository messageRep,
            IOptions<ChatSettings> chatOpts)
        {
            _mapper = mapper;
            _messageRep = messageRep;
            _chatSettings = chatOpts.Value;
        }

        public async Task<List<MessageDTO>> GetMessagesForChat(Guid chatID, long? lastMessageTimestamp = null)
        {
            var messages = await _messageRep.GetMessagesAsync(chatID, _chatSettings.MessagesPerRequest, lastMessageTimestamp);
            return _mapper.Map<List<MessageDTO>>(messages);
        }

        public Task<OpRes<Guid>> WriteMessage(WriteMessageDTO dto)
        {
            throw new NotImplementedException();
        }
    }
}
