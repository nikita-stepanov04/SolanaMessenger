using AutoMapper;
using SolanaMessenger.Application.Cryptography;
using SolanaMessenger.Application.DTOs;
using SolanaMessenger.Domain.Entities;
using SolanaMessenger.Infrastructure;
using SolanaMessenger.Infrastructure.Blockchain;

namespace SolanaMessenger.Application.BusinessServices
{
    public class ChatBS : IChatBS
    {
        const string CHAT_SALT_LABEL = "chat_salt";
        const string CHAT_ADD_LABEL = "chat_aad";

        private readonly IMapper _mapper;
        private readonly IUserRepository _userRep;
        private readonly IChatRepository _chatRep;
        private readonly IBlockchainRepository<ChatData> _blockchainChatRep;
        private readonly IBlockchainRepository<UserData> _blockchainUserRep;

        public ChatBS(
            IMapper mapper,
            IUserRepository userRep,
            IChatRepository chatRep,
            IBlockchainRepository<ChatData> blockchainChatRep,
            IBlockchainRepository<UserData> blockchainUserRep)
        {
            _mapper = mapper;
            _userRep = userRep;
            _chatRep = chatRep;
            _blockchainChatRep = blockchainChatRep;
            _blockchainUserRep = blockchainUserRep;
        }

        public async Task<OpRes<Guid>> CreateChatAsync(ChatCreateDTO chatDTO)
        {
            var usersIDs = chatDTO.ChatUsersIDs;
            var users = await _userRep.GetByIDsAsync(usersIDs);

            if (users.Count != usersIDs.Count)
                return OpRes.Err<Guid>("One or more users do not exist.");

            var userDataTasks = users.Select(u => _blockchainUserRep.GetObjectAsync(u.Signatures));
            var usersData = await Task.WhenAll(userDataTasks);

            var success = usersData.All(ud => ud != null);
            if (!success)
                return OpRes.Err<Guid>();

            var chatID = Guid.NewGuid();
            var encryption = new Encryption();
            var aes256key = encryption.RandomAES256Key;

            var userPayload = usersData
                .Select(ud => new
                {
                    UserData = ud!,
                    Wrap = encryption.WrapAESKeyWithECDH(
                        aes256Key: aes256key,
                        recipientX25519Pub: ud!.X25519Pub,
                        salt: Hashing.Sha256(CHAT_SALT_LABEL, chatID.ToString()),
                        aad: Hashing.Sha256(CHAT_ADD_LABEL, chatID.ToString(), ud!.ID.ToString())
                    )
                })
                .ToDictionary(
                    wd => wd.UserData.ID,
                    wd => new UserPayload()
                    {
                        EphemeralPublicKey = wd.Wrap.EphemeralPublicKey,
                        Nonce = wd.Wrap.Nonce,
                        EncryptedMessageEncryptionKey = wd.Wrap.WrapedKey,
                        FirstName = wd.UserData.FirstName,
                        SecondName = wd.UserData.SecondName,
                        LastName = wd.UserData.LastName
                    }
                );

            var chatData = new ChatData()
            {
                ID = chatID,
                Name = chatDTO.Name,
                TimeStamp = LinuxTimeStamp.UtcNow,
                UserPayload = userPayload
            };

            var signatures = await _blockchainChatRep.WriteObjectAsync(chatData);
            if (signatures == null)
                return OpRes.Err<Guid>();

            var chat = new Chat()
            {
                ID = chatID,
                Name = chatDTO.Name,
                Signatures = signatures,
                Users = users
            };

            await _chatRep.AddAsync(chat);
            await _chatRep.SaveChangesAsync();

            return OpRes.Success(chatID);
        }

        public async Task<OpRes<ChatDTO>> GetByChatIDForUserAsync(Guid chatId, Guid userID)
        {
            var chat = await _chatRep.GetByIDAsync(chatId);
            var isMember = chat?.Users.Any(u => u.ID == userID) ?? false;

            if (chat == null)
                return OpRes.Err<ChatDTO>("Chat not found.");
            else if (!isMember)
                return OpRes.Err<ChatDTO>("User is not a member of the chat.");

            var chatData = await _blockchainChatRep.GetObjectAsync(chat.Signatures);

            if (chatData == null) 
                return OpRes.Err<ChatDTO>();

            var dto = _mapper.Map<ChatDTO>(chatData, opts => opts.Items["UserID"] = userID);
            return OpRes.Success(dto);
        }

        public async Task<List<ChatMinimalDTO>> GetAllByUserIDAsync(Guid userID)
        {
            var chats = await _chatRep.GetAllByUserIDAsync(userID);
            var dtos = _mapper.Map<List<ChatMinimalDTO>>(chats);
            return dtos;
        }
    }
}
