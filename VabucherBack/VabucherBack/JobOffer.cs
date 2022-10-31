using VaBucherBack;

namespace VabucherBack
{
    public class JobOffer
         {
        public int Id { get; set; }
        public int IdUser{ get; set; }
        public string Title { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public string Salaire { get; set; } = string.Empty;
        public string Localisation { get; set; } = string.Empty;
        public string Types { get; set; } = string.Empty;
        public string CompanyInfo { get; set; } = string.Empty;
        public string Domain { get; set; } = string.Empty;
    }
}
