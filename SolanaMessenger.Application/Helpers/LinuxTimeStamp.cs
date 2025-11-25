namespace SolanaMessenger.Application
{
    public static class LinuxTimeStamp
    {
        public static long UtcNow => DateTimeOffset.UtcNow.ToUnixTimeMilliseconds();
    }
}
