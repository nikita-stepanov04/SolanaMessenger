namespace SolanaMessenger.Web.Models
{
    public class BoolResponse
    {
        public BoolResponse(bool result)
        {
            Result = result;
        }

        public bool Result { get; set; }
    }
}
