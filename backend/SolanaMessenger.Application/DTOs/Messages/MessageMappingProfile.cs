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
                    dest => dest.Salt,
                    src => src.ConvertUsing(new StringToByteArrConverter(), src => src.Salt)
                )
                .ForMember(
                    dest => dest.Tag,
                    src => src.ConvertUsing(new StringToByteArrConverter(), src => src.Tag)
                );

            CreateMap<MessageData, MessageDTO>()
                .ForMember(
                    dest => dest.Salt,
                    src => src.ConvertUsing(new ByteArrToStringConverter(), src => src.Salt)
                )
                .ForMember(
                    dest => dest.Tag,
                    src => src.ConvertUsing(new ByteArrToStringConverter(), src => src.Tag)
                );

        }
    }
}
