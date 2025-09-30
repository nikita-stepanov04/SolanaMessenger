namespace SolanaMessenger.Infrastructure.Blockchain
{
    internal class DataWrapper
    {
        public DataWrapper() { }
        internal DataWrapper(string type, string data, int part = 0)
        {
            Type = type;
            Data = data;
            Part = part;
        }

        public int Part { get; set; }
        public string Type { get; set; } = null!;
        public string Data { get; set; } = null!;
    }
}
