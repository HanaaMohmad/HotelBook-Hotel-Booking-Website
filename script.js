const $ = (s, root=document) => root.querySelector(s);
const $$ = (s, root=document) => [...root.querySelectorAll(s)];
const form = $("#searchForm");
const destination = $("#destination");
const checkin = $("#checkin");
const checkout = $("#checkout");
const searchMessage = $("#searchMessage");
const cards = $$(".hotel-card");
const emptyState = $("#emptyState");
const hotelGrid = $("#hotelGrid");
const today = new Date();
const isoDate = d => `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}-${String(d.getDate()).padStart(2,"0")}`;
checkin.min = isoDate(today);
const tomorrow = new Date(today); tomorrow.setDate(today.getDate()+1);
checkin.value = isoDate(today);
checkout.min = isoDate(tomorrow);
checkout.value = isoDate(new Date(today.getFullYear(),today.getMonth(),today.getDate()+3));
checkin.addEventListener("change", () => {
  const day = new Date(checkin.value + "T12:00:00"); day.setDate(day.getDate()+1);
  checkout.min = isoDate(day);
  if (!checkout.value || checkout.value <= checkin.value) checkout.value = isoDate(day);
});
function filterHotels(city="") {
  let shown=0;
  cards.forEach(card => {
    const text = (card.dataset.city + " " + $(".hotel-info h3",card).textContent + " " + $(".location",card).textContent).toLowerCase();
    const match = !city || text.includes(city.toLowerCase());
    card.hidden = !match;
    if(match) shown++;
  });
  emptyState.hidden = shown > 0;
  searchMessage.textContent = city ? (shown ? `${shown} hotel${shown===1?"":"s"} found for ${city}.` : `No listed hotels found for ${city}. Try another destination.`) : "Showing all featured hotels.";
  $("#hotels").scrollIntoView({behavior:"smooth",block:"start"});
}
form.addEventListener("submit", e => {
  e.preventDefault();
  if (checkout.value <= checkin.value) {
    searchMessage.textContent = "Check-out must be after check-in.";
    checkout.focus(); return;
  }
  filterHotels(destination.value);
});
$$(".destination-card").forEach(card => card.addEventListener("click", () => {
  destination.value = card.dataset.destination;
  filterHotels(card.dataset.destination);
}));
$("#showAll").addEventListener("click", () => { destination.value=""; filterHotels(""); });
$("#menuToggle").addEventListener("click", () => $("#mainNav").classList.toggle("open"));
$$("#mainNav a").forEach(a => a.addEventListener("click", () => $("#mainNav").classList.remove("open")));
const backdrop=$("#modalBackdrop");
const modalDescription=$("#modalDescription");
let selectedHotel="";
$$(".book-btn").forEach(btn => btn.addEventListener("click", () => {
  selectedHotel=btn.dataset.hotel;
  modalDescription.textContent=`You're starting a demo booking for ${selectedHotel} at ${btn.dataset.price} per night.`;
  $("#modalCheckin").value=checkin.value;
  $("#modalCheckout").value=checkout.value;
  $("#modalCheckin").min=isoDate(today);
  $("#modalCheckout").min=isoDate(tomorrow);
  $("#modalTitle").textContent="Book your stay";
  backdrop.hidden=false;
  $("#guestName").focus();
}));
$("#signInBtn").addEventListener("click", () => {
  selectedHotel="";
  modalDescription.textContent="Sign-in is a visual demo and does not create an account.";
  $("#modalTitle").textContent="Welcome to HotelBook";
  backdrop.hidden=false;
  $("#guestName").focus();
});
$("#modalClose").addEventListener("click", () => backdrop.hidden=true);
backdrop.addEventListener("click", e => { if(e.target===backdrop) backdrop.hidden=true; });
document.addEventListener("keydown", e => { if(e.key==="Escape") backdrop.hidden=true; });
$("#bookingForm").addEventListener("submit", e => {
  e.preventDefault();
  const ci=$("#modalCheckin").value, co=$("#modalCheckout").value;
  if(co<=ci){ alert("Check-out must be after check-in."); return; }
  modalDescription.innerHTML=`<span class="success-message">Thanks, ${$("#guestName").value}! Your demo request for ${selectedHotel || "HotelBook"} has been recorded on this page.</span>`;
  $("#modalTitle").textContent="Request received";
  $("#bookingForm").reset();
});
