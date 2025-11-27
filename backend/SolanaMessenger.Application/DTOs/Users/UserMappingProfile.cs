using AutoMapper;
using SolanaMessenger.Application.AutoMapper;
using SolanaMessenger.Domain.Entities;

namespace SolanaMessenger.Application.DTOs.Users
{
    public class UserMappingProfile : Profile
    {
        public UserMappingProfile() 
        {
            CreateMap<UserData, UserDTO>()
                .ForMember(
                    dest => dest.X25519Pub,
                    opt => opt.ConvertUsing(new ByteArrToStringConverter(), src => src.X25519Pub)
                )
                .ReverseMap()
                .ForMember(
                    dest => dest.X25519Pub,
                    opt => opt.ConvertUsing(new StringToByteArrConverter(), src => src.X25519Pub)
                );
        }
    }
}
