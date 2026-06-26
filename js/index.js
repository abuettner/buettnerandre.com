const newsJsonUrl = "news.json";

let news = [];

async function fetchNews() {
    const res = await fetch(newsJsonUrl, { headers: { 'Accept': 'application/json' } });
    if (!res.ok) {
        console.error('Error fetching news:', res.status, res.statusText);
        return;
    }

    let items = await res.json();

    if (!Array.isArray(items) || items.length === 0) {
        done = true;
        return;
    }

    // Sort items by date
    items.sort((a, b) => b.date.localeCompare(a.date));

    return items;
}

function escapeHtml(s) {
    return s ? String(s)
        .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;') : '';
}


function setNewsTeaser() {
    fetchNews().then((items) => {
        for (let i = 0; i < items.length; i++) {
            if (items[i].status == "active") {
                document.getElementById("news-date").innerHTML = escapeHtml(items[i].date);
                document.getElementById("news-title").innerHTML = `<a href="/news.html#item${i}">${escapeHtml(items[i].title)}</a>`;
                if(items[i].subtitle) document.getElementById("news-subtitle").innerHTML = escapeHtml(items[i].subtitle);

                $("div#news-teaser-container").show();
                return;
            }
        }
        // Hide news teaser if not available
        $("div#news-teaser-container").hide();
    });

}

setNewsTeaser();