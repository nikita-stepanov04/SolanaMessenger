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
                    dest => dest.PublicEncryptionKey,
                    opt => opt.ConvertUsing(new StringToByteArrConverter(), src => src.PublicEncryptionKey)
                )
                .ForMember(
                    dest => dest.Salt,
                    opt => opt.ConvertUsing(new StringToByteArrConverter(), src => src.Salt)
                );
        }
    }
}
