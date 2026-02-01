using Solnet.Wallet.Utilities;
using System.Text;
using System.Text.Json.Serialization;

namespace SolanaMessenger.Infrastructure.Blockchain.SolanaRepository
{
    internal class HeliusResponse
    {
        [JsonPropertyName("result")]
        public ResultBlock Result { get; set; } = null!;

        internal class ResultBlock
        {
            [JsonPropertyName("transaction")]
            public TransactionBlock Transaction { get; set; } = null!;
        }

        internal class TransactionBlock
        {
            [JsonPropertyName("message")]
            public MessageBlock Message { get; set; } = null!;
        }

        internal class MessageBlock
        {
            [JsonPropertyName("accountKeys")]
            public List<string> AccountKeys { get; set; } = null!;

            [JsonPropertyName("instructions")]
            public List<InstructionBlock> Instructions { get; set; } = null!;
        }

        internal class InstructionBlock
        {
            [JsonPropertyName("data")]
            public string Data { get; set; } = null!;

            [JsonPropertyName("programIdIndex")]
            public int ProgramIDIndex { get; set; }
        }

        internal string? GetMemoData()
        {
            var message = Result.Transaction.Message;

            var memoDataProgramIndex = message.AccountKeys.FindIndex(ak => ak.StartsWith("Memo"));
            if (memoDataProgramIndex != -1)
            {
                var base58Data = message.Instructions.FirstOrDefault(i => i.ProgramIDIndex == memoDataProgramIndex)?.Data;
                var decodedData = Encoders.Base58.DecodeData(base58Data);
                return Encoding.UTF8.GetString(decodedData);
            }

            return null;
        }
    }

}
