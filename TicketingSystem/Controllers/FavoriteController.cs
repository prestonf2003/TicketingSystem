using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using TicketingSystem.Models;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace TicketingSystem.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class FavoriteController : Controller
    {
        
        TicketDBContext db = new TicketDBContext();

        [HttpGet("ShowAllFavorites")]
        public List<Favorite> ShowAllFavorites()
        {
            return db.Favorites.ToList();
        }

        /*[HttpPut("CreateNewFavorite")]
        public string CreateFavorite(Favorite f)
        {
            db.Favorites.Add(f);
            db.SaveChanges();
            return $"{f.Id} was added to the database";
        }

        [HttpDelete("DeleteFavorite/{id}")]
        public string DeleteFavorite(int id)
        {
            Favorite f = db.Favorites.Find(id);

            db.Favorites.Remove(f);
            db.SaveChanges();
            return $"{f.Id} was removed from the database";
        }*/ 
        
    }
}

