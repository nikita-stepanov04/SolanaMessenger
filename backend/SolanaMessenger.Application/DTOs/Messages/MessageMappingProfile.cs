using AutoMapper;
using SolanaMessenger.Application.AutoMapper;
using SolanaMessenger.Domain.Entities;

namespace SolanaMessenger.Application.DTOs
{
    public class MessageMappingProfile : Profile
    {
        public MessageMappingProfile() 
        {
            CreateMap<WriteMessageDTO, MessageData>()                
                .ForMember(
                    dest => dest.Nonce,
                    src => src.ConvertUsing(new StringToByteArrConverter(), src => src.Nonce)
                )
                .ForMember(
                    dest => dest.Tag,
                    src => src.ConvertUsing(new StringToByteArrConverter(), src => src.Tag)
                );

            CreateMap<MessageData, MessageDTO>()
                .ForMember(
                    dest => dest.Nonce,
                    src => src.ConvertUsing(new ByteArrToStringConverter(), src => src.Nonce)
                )
                .ForMember(
                    dest => dest.Tag,
                    src => src.ConvertUsing(new ByteArrToStringConverter(), src => src.Tag)
                );

        }
    }
}
