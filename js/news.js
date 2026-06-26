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

function createListItem(item, id) {
    const li = document.createElement('li');
    li.className = 'list-group-item news-item';

    let itemHTML = `
        <div class="d-flex justify-content-between align-items-start">
      <div>
        <h6 class="mb-1">${escapeHtml(item.title)}${item.status == "inactive" ? " (inactive)" : ""}</h6><div><small>${escapeHtml(item.subtitle)}</small></div>
        <small class="text-muted"><i class="bi bi-calendar3"></i> ${escapeHtml(item.date)} ${item.date !== item.lastupdated ? "(Last updated: " + escapeHtml(item.lastupdated) + ")" : ""}</small>
      </div>
      <button class="btn btn-sm btn-outline-primary" data-bs-toggle="collapse" data-bs-target="#item${id}" aria-expanded="false" aria-controls="item${id}">
        Read
      </button>
    </div>

    <div class="collapse mt-3" id="item${id}">
      <p class="mb-1">${escapeHtml(item.summary)} </p><br/>
      <div class="d-flex gap-2">`;
    for (let i = 0; i < item.actions.length; i++) {
        itemHTML += `<a href="${encodeURI(item.actions[i].url)}" class="btn btn-sm btn-primary mb-1 ${item.status == "inactive" ? "disabled" : ""}">${item.actions[i].label}</a> `;
    }
    itemHTML += `</div>
    </div> 
    `
    li.innerHTML = itemHTML;

    return li;
}

function renderItems() {
    fetchNews().then((items) => {
        document.getElementById("news-feed").innerHTML = "";
        for (let i = 0; i < items.length; i++) {
            document.getElementById("news-feed").append(createListItem(items[i], i));
        }

        // Show contents if query parameter is provided
        let hash = window.location.hash;
        if (hash) {
            const targetElement = document.querySelector(hash);
            if (targetElement && targetElement.classList.contains("collapse")) {
                const bsCollapse = new bootstrap.Collapse(targetElement, {
                    toggle: true
                });
            }
        }

    });

}


renderItems();