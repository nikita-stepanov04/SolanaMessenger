using AutoMapper;
using SolanaMessenger.Domain.Entities;

namespace SolanaMessenger.Application.DTOs
{
    public class ChatMappingProfile : Profile
    {
        public ChatMappingProfile()
        {
            CreateMap<ChatData, ChatDTO>()
                .ForMember(
                    dest => dest.EncryptionPayload,
                    src => src.ConvertUsing(new ChatDataToEncryptionPayloadDTOConverter(), src => src)
                )
                .ForMember(
                    dest => dest.UsersData,
                    src => src.ConvertUsing(new ChatDataToChatUsersDataConverter(), src => src)
                );
        }

        class ChatDataToEncryptionPayloadDTOConverter : IValueConverter<ChatData, UserPayloadDTO>
        {
            public UserPayloadDTO Convert(ChatData chatData, ResolutionContext context)
            {
                var userID = Guid.Parse(context.Items["UserID"].ToString()!);
                var payload = chatData.UserPayload[userID];
                var dto = new UserPayloadDTO()
                {
                    Nonce = payload.Nonce,
                    EphemeralPublicKey = payload.EphemeralPublicKey,
                    EncryptedMessageEncryptionKey = payload.EncryptedMessageEncryptionKey
                };
                return dto;
            }
        }

        class ChatDataToChatUsersDataConverter : IValueConverter<ChatData, List<ChatUsersDataDTO>>
        {
            public List<ChatUsersDataDTO> Convert(ChatData chatData, ResolutionContext context)
            {
                var data = chatData.UserPayload
                    .Select(up => new ChatUsersDataDTO()
                    {
                        ID = up.Key,
                        FirstName = up.Value.FirstName,
                        SecondName = up.Value.SecondName,
                        LastName = up.Value.LastName
                    })
                    .ToList();
                return data;
            }
        }
    }
}
