using AutoMapper;
using SolanaMessenger.Domain.Entities;

namespace SolanaMessenger.Application.DTOs
{
    public class ChatMinimalProfile : Profile
    {
        public ChatMinimalProfile()
        {
            CreateMap<Chat, ChatMinimalDTO>();
        }
    }
}
