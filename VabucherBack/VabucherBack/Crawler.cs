using System.Diagnostics;

namespace VabucherBack
{
    public class Crawler
    {
        public static Task WebScrapper()
        {
            Process process = new Process();
            process.StartInfo.FileName = "cmd.exe";
            process.StartInfo.Arguments = "/C node C:/Users/florian.lejosne/Code/VaBucher/Crawler/crawler.js";
            // /C is important
            Console.WriteLine("working");
            process.Start();
            return Task.CompletedTask;
        }
    }
}