using AutoMapper;
using SolanaMessenger.Domain.Entities;

namespace SolanaMessenger.Application.DTOs
{
    public class MessageMappingProfile : Profile
    {
        public MessageMappingProfile() 
        {
            CreateMap<WriteMessageDTO, MessageData>();
            CreateMap<MessageData, MessageDTO>();
        }
    }
}
