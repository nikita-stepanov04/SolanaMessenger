using AutoMapper;
using SolanaMessenger.Application.AutoMapper;
using SolanaMessenger.Domain.Entities;

namespace SolanaMessenger.Application.DTOs.Users
{
    public class UserMappingProfile : Profile
    {
        public UserMappingProfile() 
        {
            CreateMap<User, UserDTO>()
                .ForMember(dest => dest.Password, opt => opt.Ignore())
                .ForMember(
                    dest => dest.PublicEncryptionKey,
                    opt => opt.ConvertUsing(new ByteArrToStringConverter(), src => src.PublicEncryptionKey)
                )
                .ForMember(
                    dest => dest.Salt,
                    opt => opt.ConvertUsing(new ByteArrToStringConverter(), src => src.Salt)
                )
                .ReverseMap()
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
