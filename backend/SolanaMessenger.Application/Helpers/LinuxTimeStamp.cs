namespace SolanaMessenger.Application
{
    public static class LinuxTimeStamp
    {
        public static long UtcNow => (DateTimeOffset.UtcNow.Ticks - DateTimeOffset.UnixEpoch.Ticks) / 10;
    }
}
