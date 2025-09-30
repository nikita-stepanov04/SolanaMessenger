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

        internal string Serialize() => $"{Part}|{Type}|{Data}";

        internal static DataWrapper Deserialize(string serializedWrapper)
        {
            var parts = serializedWrapper.Split('|', 3);
            return new DataWrapper
            {
                Part = int.Parse(parts[0]),
                Type = parts[1],
                Data = parts[2]
            };
        }
    }
}
