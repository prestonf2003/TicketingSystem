using System;
using System.Collections.Generic;

namespace TicketingSystem.Models
{
    public partial class Ticket
    {
        public Ticket()
        {
            Favorites = new HashSet<Favorite>();
        }

        public int Id { get; set; }
        public string? OpenedUserId { get; set; }
        public string? Title { get; set; }
        public string? ResolvedUserId { get; set; }
        public string? Resolution { get; set; }
        public bool? IsOpen { get; set; }
        public string? ProblemDescription { get; set; }
        public DateTime OpenDate { get; set; }
        public DateTime? CloseDate { get; set; }

        public virtual ICollection<Favorite> Favorites { get; set; }
    }
}
