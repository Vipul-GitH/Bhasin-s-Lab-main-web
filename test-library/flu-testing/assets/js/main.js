const data={symptoms:["Sudden fever or feeling feverish","Chills","Cough","Sore throat","Runny or blocked nose","Headache","Muscle and body aches","Marked fatigue or weakness","Reduced appetite","Vomiting or diarrhoea, especially in children"],warnings:["Breathlessness or difficulty breathing","Chest pain","Bluish lips, face or nails","Confusion, fainting or altered consciousness","Severe lethargy, dehydration or marked weakness","Coughing blood","Poor feeding in a young child","Symptoms that improve and then become significantly worse","Worsening of an important underlying condition"],proof:["Same 8–10 hour TAT for night, Sunday and holiday samples","Home collection across Delhi & NCR included in the price","No appointment or documentation required","Walk-in access at GK-I, 24×7×365"],guidance:["Symptoms are moderate, severe or worsening","The patient is pregnant, very young, older or immunocompromised","There is asthma, diabetes, heart, lung, kidney or liver disease","Pneumonia or lower-respiratory disease is suspected","Identifying the virus may change clinical management","A doctor recommends RT-PCR or an outbreak needs confirmation"],focused:["Influenza A","Influenza B","Influenza A H1N1","Influenza A H3N2","Respiratory Syncytial Virus"],expanded:["Influenza A, B and C","H1N1 and H3N2","Respiratory Syncytial Virus A and B","Human Metapneumovirus A and B","Rhinovirus and Adenovirus","Enterovirus and Human bocavirus"]};
const viruses=[["Influenza A","A major cause of seasonal flu. H1N1 and H3N2 are Influenza A subtypes."],["H1N1 (Swine flu)","Symptoms alone cannot reliably separate it from H3N2; subtype identification adds precision."],["H3N2","Another seasonal Influenza A subtype that can cause substantial illness."],["Influenza B","Clinically indistinguishable from Influenza A and should not be assumed mild."],["Influenza C","Usually milder, but can cause lower-respiratory illness."],["RSV A/B","Important in infants, older adults and vulnerable people."],["Human metapneumovirus A/B","Can resemble RSV, with cough, wheeze or pneumonia."],["Rhinovirus","A frequent cause of colds and an important asthma trigger."],["Adenovirus","May cause respiratory, eye or gastrointestinal symptoms."],["Enterovirus","EV-D68 can cause severe wheeze; new weakness needs urgent assessment."],["Human bocavirus","Mostly associated with respiratory illness in young children."]];
const faqs=[["Can symptoms tell H1N1 from H3N2 or Influenza B?","No. Symptom overlap is too great for reliable bedside identification."],["When is the best time to test?","Respiratory viral load is generally highest early in illness, so early collection can improve yield."],["Should I wait for the PCR report before treatment?","Not if you are very unwell. Clinically indicated treatment should not be delayed solely for a result."],["What sample is collected?","A trained collector takes a combined nasopharyngeal and oropharyngeal swab. No fasting is required."],["Does a negative panel rule out infection?","No. It does not exclude every virus, bacterial infection or non-infectious illness."],["Do I need an appointment or prescription?","No. Walk in 24×7 at GK-I or request home collection, subject to availability."],["Is home collection extra?","No extra home-collection charge is added to these test prices."]];
const add=(id,items,html)=>{const root=document.getElementById(id);if(!root||root.children.length)return;items.forEach((item,i)=>root.insertAdjacentHTML("beforeend",html(item,i)));};
const symptomIcons=["thermometer","snowflake","lungs","mic-2","wind","brain","activity","battery-low","utensils","baby"];
const warningIcons=["wind","heart-pulse","circle-alert","brain","droplets","shield-alert","baby","trending-down","stethoscope"];
const guidanceIcons=["activity","users","heart-pulse","lungs","microscope","stethoscope"];
add("symptom-list",data.symptoms,(x,i)=>`<p><i data-lucide="${symptomIcons[i]}"></i>${x}</p>`);add("warning-list",data.warnings,(x,i)=>`<p><i data-lucide="${warningIcons[i]}"></i><span>${x}</span></p>`);add("proof-list",data.proof,x=>`<p><i data-lucide="check"></i>${x}</p>`);add("guidance-list",data.guidance,(x,i)=>`<p><i data-lucide="${guidanceIcons[i]}"></i><span>${x}</span></p>`);add("focused-list",data.focused,x=>`<li><i data-lucide="check"></i>${x}</li>`);add("expanded-list",data.expanded,x=>`<li><i data-lucide="check"></i>${x}</li>`);add("virus-list",viruses,([n,t],i)=>`<details ${i<2?"open":""}><summary><span>${String(i+1).padStart(2,"0")}</span>${n}<b>+</b></summary><p>${t}</p></details>`);add("faq-list",faqs,([q,a])=>`<details><summary>${q}<b>+</b></summary><p>${a}</p></details>`);
const whatsapp="https://wa.me/919311193111?text=Hello%20Dr%20Bhasin%27s%20Lab%2C%20I%20want%20to%20enquire%20about%20flu%20RT-PCR%20testing.";document.querySelectorAll(".whatsapp").forEach(a=>a.href=whatsapp);document.querySelectorAll(".directions").forEach(a=>a.href="https://www.google.com/maps/search/?api=1&query=Dr+Bhasin%27s+Lab+S-35+Greater+Kailash+1+New+Delhi");

const callbackModal=document.querySelector("#callback-modal");
const callbackClose=document.querySelector(".callback-modal-close");
const callbackFrame=document.querySelector("#callback-form-frame");
const sharedFormUrl="../../integrations/callback-form/callback-form.html?embed=modal&v=4&source=flu-test";
const openCallbackModal=(trigger)=>{
  const service=trigger.dataset.callbackService||"Home collection";
  callbackFrame.src=`${sharedFormUrl}&service=${encodeURIComponent(service)}`;
  if(!callbackModal.open)callbackModal.show();
  document.body.classList.add("modal-open");
};
document.querySelectorAll(".callback-trigger").forEach(trigger=>{
  trigger.addEventListener("click",()=>openCallbackModal(trigger));
  trigger.addEventListener("keydown",event=>{
    if(event.key==="Enter"||event.key===" "){
      event.preventDefault();
      openCallbackModal(trigger);
    }
  });
});
callbackClose.addEventListener("click",()=>callbackModal.close());
callbackModal.addEventListener("click",event=>{
  if(event.target===callbackModal)callbackModal.close();
});
callbackModal.addEventListener("close",()=>document.body.classList.remove("modal-open"));
document.addEventListener("keydown",event=>{
  if(event.key==="Escape"&&callbackModal.open)callbackModal.close();
});
window.lucide?.createIcons({attrs:{"aria-hidden":"true"}});
