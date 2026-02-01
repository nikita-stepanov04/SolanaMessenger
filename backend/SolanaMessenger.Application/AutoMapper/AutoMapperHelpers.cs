using AutoMapper;

namespace SolanaMessenger.Application.AutoMapper
{
    public class ByteArrToStringConverter : IValueConverter<byte[], string>
    {
        public string Convert(byte[] sourceMember, ResolutionContext context)
        {
            return System.Convert.ToBase64String(sourceMember);
        }
    }

    public class StringToByteArrConverter : IValueConverter<string, byte[]>
    {
        public byte[] Convert(string sourceMember, ResolutionContext context)
        {
            return System.Convert.FromBase64String(sourceMember);
        }
    }
}
