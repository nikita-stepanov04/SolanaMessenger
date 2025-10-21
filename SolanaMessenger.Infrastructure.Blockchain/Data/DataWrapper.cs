namespace SolanaMessenger.Infrastructure.Blockchain
{
    internal class DataWrapper
    {
        const short VERSION = 1;
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

        internal string Serialize() => $"{VERSION}|{Part}|{Type}|{Data}";

        internal static DataWrapper Deserialize(string serializedWrapper)
        {
            var parts = serializedWrapper.Split('|', 4);
            return new DataWrapper
            {
                Part = int.Parse(parts[1]),
                Type = parts[2],
                Data = parts[3]
            };
        }
    }
}
