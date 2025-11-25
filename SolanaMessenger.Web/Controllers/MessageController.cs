using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SolanaMessenger.Application;
using SolanaMessenger.Application.DTOs;
using SolanaMessenger.Web.Identity;

namespace SolanaMessenger.Web.Controllers
{
    [Route("api/message")]
    [Authorize(Policy = Policies.AuthorizedAny)]
    public class MessageController : MessengerControllerBase
    {
        private readonly IMessageBS _messageBS;

        public MessageController(IMessageBS messageBS)
        {
            _messageBS = messageBS;
        }

        [HttpGet("list/{chatID}/{lastMessageTimestamp}")]
        [ProducesResponseType<List<MessageDTO>>(StatusCodes.Status200OK)]
        [ProducesResponseType<MessageResponse>(StatusCodes.Status403Forbidden)]
        public async Task<IActionResult> LoadMessages(
            [FromRoute] Guid chatID,
            [FromRoute] long lastMessageTimestamp)
        {
            var res = await _messageBS.LoadChatMessagesAsync(chatID, UserID, lastMessageTimestamp);

            if (res.HasError)
                return Forbid(res.ErrorMessage);

            return Ok(res.Result);
        }

        [HttpPost()]
        [ProducesResponseType<Guid>(StatusCodes.Status200OK)]
        [ProducesResponseType<MessageResponse>(StatusCodes.Status403Forbidden)]
        public async Task<IActionResult> WriteMessage(
            [FromBody] WriteMessageDTO dto)
        {
            var res = await _messageBS.WriteMessageAsync(dto, UserID);

            if (res.HasError)
                return Forbid(res.ErrorMessage);

            return Ok(res.Result);
        }
    }
}
