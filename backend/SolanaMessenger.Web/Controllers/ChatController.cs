using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SolanaMessenger.Application;
using SolanaMessenger.Application.DTOs;
using SolanaMessenger.Web.Identity;

namespace SolanaMessenger.Web.Controllers
{
    [Route("api/chat")]
    public class ChatController : MessengerControllerBase
    {
        private readonly IChatBS _chatBS;

        public ChatController(
            IChatBS chatBS)
        {
            _chatBS = chatBS;
        }

        [HttpPost("create")]
        [Authorize(Policy = Policies.AuthorizedAdmins)]
        [ProducesResponseType<IDResponse>(StatusCodes.Status200OK)]
        [ProducesResponseType<MessageResponse>(StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> CreateChat([FromBody] ChatCreateDTO dto)
        {
            var result = await _chatBS.CreateChatAsync(dto);

            if (result.HasError)
                return BadRequest(new MessageResponse(result.ErrorMessage));

            return Ok(new IDResponse(result.Result));
        }

        [HttpGet("{chatID}")]
        [Authorize(Policy = Policies.AuthorizedAny)]
        [ProducesResponseType<ChatDTO>(StatusCodes.Status200OK)]
        [ProducesResponseType<MessageResponse>(StatusCodes.Status404NotFound)]
        public async Task<IActionResult> GetChatByID([FromRoute] Guid chatID)
        {
            var result = await _chatBS.GetByChatIDForUserAsync(chatID, UserID);

            if (result.HasError)
                return NotFound(new MessageResponse(result.ErrorMessage));
            
            return Ok(result.Result);
        }

        [HttpGet("all")]
        [Authorize(Policy = Policies.AuthorizedAny)]
        [ProducesResponseType<ChatMinimalDTO>(StatusCodes.Status200OK)]
        public async Task<IActionResult> GetMinimalChatsInfo()
        {
            var chats = await _chatBS.GetAllByUserIDAsync(UserID);
            return Ok(chats);
        }
    }
}
