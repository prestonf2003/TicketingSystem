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
    public class TicketController : ControllerBase
    {
        TicketDBContext db = new TicketDBContext();

        [HttpGet("ShowAllTickets")]
        public List<Ticket> ShowAllTickets()
        {
            return db.Tickets.ToList();
        }

        [HttpPut("CreateNewTicket")]
        public string CreateTicket(Ticket t)
        {
            db.Tickets.Add(t);
            db.SaveChanges();
            return $"{t.Title} was added to the database";
        }

        [HttpDelete("DeleteTicket/{id}")]
        public string DeleteTicket(int id)
        {
            Ticket t = db.Tickets.Find(id);

            db.Tickets.Remove(t);
            db.SaveChanges();
            return $"{t.Id} was removed from the database";
        }

        [HttpPost("UpdateTicket/{id}")]
        public string UpdateTicket(int id, Ticket updatedTicket)
        {
            Ticket t = db.Tickets.Find(id);

            t.Title = updatedTicket.Title;
            t.ResolvedUserId = updatedTicket.ResolvedUserId;
            t.ProblemDescription = updatedTicket.ResolvedUserId;
            t.OpenedUserId = updatedTicket.OpenedUserId;
            t.IsOpen = updatedTicket.IsOpen;
            t.IsFavorited = updatedTicket.IsFavorited;

            db.Tickets.Update(t);
            db.SaveChanges();

            return $" Ticket at ID {t.Id} has been updated";
        }

    }
}

