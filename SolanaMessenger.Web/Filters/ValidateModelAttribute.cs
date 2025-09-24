using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;
using SolanaMessenger.Application.DTOs;

namespace SolanaMessenger.Web.Filters
{
    public class ValidateModelAttribute : ActionFilterAttribute
    {
        public override void OnActionExecuting(ActionExecutingContext context)
        {
            var modelState = context.ModelState;

            var errors = context.ActionArguments.Values
                .Select(p => p as DTOBase)
                .Where(dto => dto != null)
                .SelectMany(dto => dto!.Validate());

            foreach (var error in errors)
            {
                if (error.MemberNames.Any())
                {
                    foreach (var member in error.MemberNames)
                    {
                        modelState.AddModelError(member, error.ErrorMessage ?? "Validation Error");
                    }
                }
            }

            if (!context.ModelState.IsValid)
            {
                context.Result = new BadRequestObjectResult(modelState);
            }
        }
    }
}