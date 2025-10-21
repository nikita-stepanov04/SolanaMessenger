using AutoMapper;
using SolanaMessenger.Application.AutoMapper;
using SolanaMessenger.Domain.Entities;

namespace SolanaMessenger.Application.DTOs.Users
{
    public class UserRegistrationProfile : Profile
    {
        public UserRegistrationProfile()
        {
            CreateMap<UserRegistrationDTO, UserData>()
                .ForMember(
                    dest => dest.X25519Pub,
                    opt => opt.ConvertUsing(new StringToByteArrConverter(), src => src.X25519Pub)
                );
        }
    }
}
