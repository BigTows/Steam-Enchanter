let lastModification: undefined | Date = undefined;
let badgePrices: undefined | Array<object> = undefined;

interface Result {
  data: Array<object>,
  lastModification: Date
}

function updateDataBase(callback?: (response?: Result) => void) {
  fetch(`https://www.steamcardexchange.net/api/request.php?GetBadgePrices_Guest`)
    .then((response) => {
        if (response.status !== 200) {
          console.log(response.statusText);
          return;
        }
        processRequest(callback, response);
      }
    );
}

function processRequest(callback: ((response?: Result) => void) | undefined, response: Response) {
  response.json().then((json) => {
    badgePrices = json.data;
    lastModification = new Date();

    if (callback !== undefined) {
      callback(
        {
          data: badgePrices as Array<object>,
          lastModification: lastModification
        }
      );
    }
  });
}


chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {

    if (request.updateDataBase === true) {
      updateDataBase(sendResponse);
    } else {
      sendResponse(
        {
          data: badgePrices as Array<object>,
          lastModification: lastModification as Date
        }
      );
    }
    return true;
  }
);


updateDataBase();