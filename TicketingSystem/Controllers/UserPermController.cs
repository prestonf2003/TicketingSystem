using Microsoft.AspNetCore.Mvc;
using TicketingSystem.Models;

namespace TicketingSystem.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class UserPermController : Controller
    {
        TicketDBContext db = new TicketDBContext();

        [HttpGet("ShowAllUsers")]
        public List<UserPerm> ShowAllUsers()
        {
            return db.UserPerms.ToList();
        }
        [HttpPut("CreateNewUser")]
        public string CreateNewUser(UserPerm u)
        {
            db.UserPerms.Add(u);
            db.SaveChanges();
            return $"User: {u.Username} Has been created with access level {u.AccessLevel}";
        }
        [HttpDelete("DeleteUser/{username}")]
        public string DeleteUser(string username)
        {
            UserPerm u = db.UserPerms.Find(username);
            db.UserPerms.Remove(u);
            db.SaveChanges();
            return $"{u.Username} was sucessfully removed from the Database";
        }
        [HttpPost("UpdateUser/{username}")]
        public string UpdateUser(string username, UserPerm update)
        {
            UserPerm u = db.UserPerms.Find(username);
            u.Username = update.Username;
            u.AccessLevel = update.AccessLevel;
            db.UserPerms.Update(u);
            db.SaveChanges();
            return $"User with Username {u.Username} has been updated";
        }

    }
}
