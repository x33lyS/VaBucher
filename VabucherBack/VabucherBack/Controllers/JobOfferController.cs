﻿using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using VaBucherBack.Data;
using VaBucherBack;
using Microsoft.EntityFrameworkCore;
using HtmlAgilityPack;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Threading.Tasks;
using System.Net;
using System.Text;
using System.Security.Cryptography.X509Certificates;
using OpenQA.Selenium.Chrome;
using OpenQA.Selenium;
using OpenQA.Selenium.Support.UI;
using OpenQA.Selenium.Support;
using Microsoft.EntityFrameworkCore.Query.SqlExpressions;
using System.Text.RegularExpressions;

namespace VabucherBack.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class JobOfferController : ControllerBase
    {
        private readonly DataContext _context;
        public JobOfferController(DataContext context)
        {
            _context = context;
        }
        class Response
        {
            public List<JobOffer>? JobOffers { get; set; }
            public List<Search>? Searches { get; set; }
        }


        [HttpGet]
        public async Task<ActionResult<List<JobOffer>>> GetJobOffers()
        {
            return Ok(await _context.JobOffers.ToListAsync());
        }
        [HttpGet("{id}")]
        public async Task<ActionResult<JobOffer>> GetJobOfferById(int id)
        {
            var jobOffer = await _context.JobOffers.FindAsync(id);

            if (jobOffer == null)
            {
                return NotFound();
            }

            return Ok(jobOffer);
        }


        [HttpPost]
        public async Task<ActionResult<List<JobOffer>>> CreateJobOffer(JobOffer jobOffer)
        {
            var working = false;
            var options = new ChromeOptions();
            options.AddArgument(".");
            while (!working)
            {
                using (var driver = new ChromeDriver(options))
                {
                    try
                    {
                        //Navigate to DotNet website
                        driver.Navigate().GoToUrl("https://www.monster.fr/emploi/recherche?q="+ jobOffer.Domain + " " + jobOffer.Localisation + " " + jobOffer.Types + " etudiant");
                        //Click the Get Started button
                        await Task.Delay(1000);
                        var submitButton = driver.FindElement(By.Id("onetrust-accept-btn-handler"));
                        submitButton.Click();
                        var dbDomain = await _context.Searches.FirstOrDefaultAsync(u => u.Filter == jobOffer.Domain);
                        if (dbDomain == null && jobOffer.Domain != null)
                        {
                            _context.Searches.Add(new Search { Filter = jobOffer.Domain });
                            await _context.SaveChangesAsync();
                        }
                        //submitButton = driver.FindElement(By.ClassName("btn-purple-fill"));
                        //submitButton.Click();
                        string principalHandle = driver.CurrentWindowHandle;
                        // Get Started section is a multi-step wizard
                        // The following sections will find the visible next step button until there's no next step button left
                        int i = 0;
                        IWebElement nextLink = null;
                        var exist = "";
                        while (nextLink == null)
                        {
                            try
                            {
                                await Task.Delay(1000);
                                nextLink = driver.FindElement(By.ClassName("job-search-resultsstyle__JobCardWrapNew-sc-1wpt60k-6"));
                                exist = nextLink.Text;

                            }
                            catch
                            {
                                try
                                {
                                    var notfound = driver.FindElement(By.XPath("//h3[@data-testid='messageTitle']"));
                                    driver.Quit();
                                    return BadRequest("No Job found.");

                                }
                                catch { }
                            }
                        }
                        if (exist != "")
                        {
                            while (i <= driver.FindElements(By.ClassName("job-search-resultsstyle__JobCardWrapNew-sc-1wpt60k-6")).Count())
                            {


                                nextLink = driver.FindElements(By.ClassName("job-search-resultsstyle__JobCardWrapNew-sc-1wpt60k-6")).ElementAt(i);

                                var originalHandles = driver.WindowHandles;
                                nextLink.Click();
                                var newHandle = driver.WindowHandles.Except(originalHandles).Single();
                                driver.SwitchTo().Window(newHandle);




                                JobOffer offer = new JobOffer();
                                //Title
                                try
                                {
                                    var titleElement = driver.FindElement(By.ClassName("JobViewTitle"));
                                    offer.Title = titleElement.Text;
                                    offer.Domain = jobOffer.Domain;
                                    offer.Url = driver.Url;

                                }
                                catch
                                {
                                    offer.Title = "";
                                }
                                //CompanyInfo
                                try
                                {
                                    var companyInfoElement = driver.FindElement(By.ClassName("headerstyle__JobViewHeaderCompany-sc-1ijq9nh-6"));
                                    offer.CompanyInfo = companyInfoElement.Text;
                                }
                                catch
                                {
                                    offer.CompanyInfo = "";
                                }

                                //Salary
                                try
                                {
                                    var salaryElement = driver.FindElement(By.XPath("//div[@data-testid='svx_jobview-salary']"));
                                    offer.Salaire = salaryElement.Text;
                                }
                                catch
                                {
                                    offer.Salaire = "";
                                }
                                //JobTypes
                                try
                                {
                                    var jobTypesElement = driver.FindElement(By.XPath("//div[@data-test-id='svx-jobview-employmenttype']"));
                                    offer.Types = jobTypesElement.Text;
                                }
                                catch
                                {
                                    offer.Types = "";
                                }
                                //Localisation
                                try
                                {
                                    var localisationElement = driver.FindElement(By.XPath("//div[@data-test-id='svx-jobview-location']"));
                                    offer.Localisation = localisationElement.Text;
                                }
                                catch
                                {
                                    offer.Localisation = "";
                                }
                                //IsNew
                                try
                                {
                                    var isNewElement = driver.FindElement(By.XPath("//div[@data-test-id='svx-jobview-posted-or-website-div']"));
                                    string pattern = @"\d+";
                                    Match match = Regex.Match(isNewElement.Text, pattern);
                                    if (match.Success)
                                    {
                                        int number = int.Parse(match.Value);
                                        DateTime today = DateTime.Today; // Obtenez la date d'aujourd'hui
                                        DateTime dateXDaysAgo = today.AddDays(-number);
                                        // Enregistrez la date il y a X jours dans la base de données
                                        offer.IsNew = dateXDaysAgo.ToString("dd/MM/yyyy");
                                    }
                                    else
                                    {
                                        offer.IsNew = DateTime.Today.ToString("dd/MM/yyyy");
                                    }
                                    
                                }
                                catch
                                {
                                    offer.IsNew = "";
                                }
                                //Description
                                try
                                {
                                    var descriptionElement = driver.FindElement(By.ClassName("descriptionstyles__DescriptionBody-sc-13ve12b-4"));
                                    offer.Description = descriptionElement.Text;
                                }
                                catch
                                {
                                    offer.Description = "";
                                }
                                if (principalHandle != newHandle)
                                {
                                    driver.Close();
                                }
                                if (!_context.JobOffers.Any(j => j.Title == offer.Title) && offer.Title != "")
                                {
                                    _context.JobOffers.Add(offer);
                                    await _context.SaveChangesAsync();
                                }else if (_context.JobOffers.Any(j => j.Title == offer.Title))
                                {
                                    var dbOffer = _context.JobOffers.FirstOrDefault(j => j.Title == offer.Title);
                                    dbOffer.Title = offer.Title;
                                    dbOffer.Localisation = offer.Localisation;
                                    dbOffer.Description = offer.Description;
                                    dbOffer.IsNew = offer.IsNew;
                                    dbOffer.Types = offer.Types;
                                    dbOffer.CompanyInfo = offer.CompanyInfo;
                                    dbOffer.Domain = offer.Domain;
                                    dbOffer.Salaire = offer.Salaire;
                                    await _context.SaveChangesAsync();
                                }
                                i++;
                                working = true;
                                driver.SwitchTo().Window(principalHandle);

                            }
                            driver.Quit();
                        }
                    }
                    catch
                    {
                        driver.Quit();
                    }

                }

            }
            var response = new Response
            {
                JobOffers = await _context.JobOffers.ToListAsync(),
                Searches = await _context.Searches.ToListAsync()
            };
            return Ok(response);
    }

        [HttpPut("{id}")]
        public async Task<ActionResult<JobOffer>> UpdateJobOffer(int id, JobOffer jobOffer)
        {
            if (id != jobOffer.Id)
                return BadRequest("Id mismatch.");

            _context.Entry(jobOffer).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!JobOfferExists(id))
                    return NotFound("Job Offer not found.");
                else
                    throw;
            }

            return Ok(jobOffer);
        }

        private bool JobOfferExists(int id)
        {
            return _context.JobOffers.Any(e => e.Id == id);
        }


        [HttpDelete("{id}")]
    public async Task<ActionResult<List<JobOffer>>> DeleteJobOffer(int id)
    {
        var dbJobOffer = await _context.JobOffers.FindAsync(id);
        if (dbJobOffer == null)
            return BadRequest("Job Offer not found.");

        _context.JobOffers.Remove(dbJobOffer);
        await _context.SaveChangesAsync();

        return Ok(await _context.JobOffers.ToListAsync());
    }
}
}
