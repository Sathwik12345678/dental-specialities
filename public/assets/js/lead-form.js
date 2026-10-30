(function () {
  "use strict";

  var PHONE = "919811504048";
  var TREATMENTS = [
    { group: "Orthodontics", items: [
      ["clear-aligners", "Invisalign & Clear Aligners"],
      ["braces-orthodontics", "Metal Braces"],
      ["ceramic-braces", "Ceramic Braces"]
    ] },
    { group: "Preventive", items: [
      ["composite-restoration", "Composite Restoration"],
      ["root-canal-treatment", "Root Canal Treatment"],
      ["post-and-core", "Post and Core"],
      ["pit-and-fissure-sealants", "Pit & Fissure Sealants"],
      ["dental-prophylaxis", "Dental Prophylaxis"],
      ["night-guards-and-retainers", "Night Guards & Retainers"]
    ] },
    { group: "Prosthodontic", items: [
      ["complete-dentures", "Complete Dentures"],
      ["removable-partial-dentures", "Removable Partial Dentures"],
      ["zirconia-crowns", "Zirconia Crowns"],
      ["metal-ceramic-crowns", "Metal Ceramic Crowns"],
      ["full-metal-crowns", "Full Metal Crowns"],
      ["ceramic-inlay-onlay", "Ceramic Inlay / Onlay"]
    ] },
    { group: "Cosmetic", items: [
      ["teeth-whitening", "Teeth Whitening"],
      ["ceramic-veneers", "Ceramic Veneers"],
      ["composite-veneers", "Composite Veneers"],
      ["smile-makeover", "Smile Makeover"]
    ] },
    { group: "Implants", items: [["implants", "Dental Implants"]] },
    { group: "Oral surgery", items: [
      ["dental-extractions", "Dental Extractions"],
      ["wisdom-tooth-extractions", "Wisdom Tooth Extractions"]
    ] },
    { group: "Radiology", items: [
      ["intraoral-xray", "Intraoral X-ray"],
      ["opg-xray", "OPG X-ray"],
      ["cbct-scan", "CBCT Scan"]
    ] },
    { group: "Other", items: [
      ["general-checkup", "General Check-up"],
      ["not-sure", "Not sure yet"]
    ] }
  ];
  var TREATMENT_LABELS = {};
  TREATMENTS.forEach(function (group) {
    group.items.forEach(function (item) { TREATMENT_LABELS[item[0]] = item[1]; });
  });

  function currentTreatment() {
    var slug = window.location.pathname.split("/").pop().replace(/\.html?$/i, "");
    var aliases = {
      "braces-cost-delhi": "braces-orthodontics",
      "braces-for-kids-teens": "braces-orthodontics",
      "orthodontist-south-delhi": "braces-orthodontics",
      "invisalign-cost-delhi": "clear-aligners",
      "invisalign-vs-braces": "clear-aligners",
      "aligner-consultation": "clear-aligners",
      "invisalign": "clear-aligners",
      "orthodontist": "braces-orthodontics",
      "dental-implants-guide": "implants"
    };
    if (aliases[slug]) slug = aliases[slug];
    return TREATMENT_LABELS[slug] ? slug : "not-sure";
  }

  function pushEvent(name, values) {
    window.dataLayer = window.dataLayer || [];
    var event = values || {};
    event.event = name;
    window.dataLayer.push(event);
  }

  function pagePath() {
    return window.location.pathname;
  }

  function firstTouch() {
    var keys = ["gclid", "gbraid", "wbraid", "utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content"];
    var query = new URLSearchParams(window.location.search);
    var incoming = {};
    keys.forEach(function (key) {
      var value = query.get(key);
      if (value) incoming[key] = value;
    });

    var stored = null;
    try {
      stored = JSON.parse(window.sessionStorage.getItem("ds_attr") || "null");
    } catch (error) {
      stored = null;
    }

    var clickIds = ["gclid", "gbraid", "wbraid"];
    var hasNewClickId = clickIds.some(function (key) {
      return incoming[key] && incoming[key] !== (stored && stored[key]);
    });
    if (!stored || hasNewClickId) {
      var referrerHost = "";
      try {
        referrerHost = document.referrer ? new URL(document.referrer).hostname : "";
      } catch (error) {
        referrerHost = "";
      }
      stored = {
        landing_page_path: pagePath(),
        referrer_hostname: referrerHost,
        timestamp: new Date().toISOString()
      };
      keys.forEach(function (key) {
        stored[key] = incoming[key] || "";
      });
      try {
        window.sessionStorage.setItem("ds_attr", JSON.stringify(stored));
      } catch (error) {
        stored = stored;
      }
    }
    return stored;
  }

  firstTouch();

  function ctaLocation(link) {
    if (link.closest("header")) return "header";
    if (link.closest(".subtreatment-hero,.hero")) return "hero";
    if (link.closest("footer")) return "footer";
    if (link.closest("#fab,.sticky-mobile-bar")) return "bottom_cta";
    if (link.closest(".consult-modal")) return "post_submit";
    return "bottom_cta";
  }

  function setupCtas(treatmentId) {
    document.querySelectorAll('a[href^="tel:"],a[href*="wa.me"]').forEach(function (link) {
      var href = link.getAttribute("href") || "";
      if (href.indexOf("tel:") === 0) {
        link.href = "tel:+91" + PHONE.slice(2);
        link.setAttribute("data-cta-type", "phone");
      } else {
        try {
          var url = new URL(href, window.location.href);
          url.hostname = "wa.me";
          url.pathname = "/" + PHONE;
          var message = url.searchParams.get("text");
          url.search = "";
          url.searchParams.set("text", message || "Hi Dental Specialities, I would like to enquire about an appointment.");
          link.href = url.toString();
        } catch (error) {
          link.href = "https://wa.me/" + PHONE;
        }
        link.setAttribute("data-cta-type", "whatsapp");
      }
      link.setAttribute("data-cta-location", ctaLocation(link));
      link.setAttribute("data-treatment-id", treatmentId);
    });
  }

  function makeTreatmentSelect(id, defaultTreatment) {
    var select = document.createElement("select");
    select.id = id;
    select.name = "treatment_id";
    select.required = true;
    select.setAttribute("aria-label", "Treatment of interest");

    TREATMENTS.forEach(function (group) {
      var optgroup = document.createElement("optgroup");
      optgroup.label = group.group;
      group.items.forEach(function (item) {
        var option = document.createElement("option");
        option.value = item[0];
        option.textContent = item[1];
        option.selected = item[0] === defaultTreatment;
        optgroup.appendChild(option);
      });
      select.appendChild(optgroup);
    });
    return select;
  }

  function addField(form, labelText, name, type, id, required, autocomplete) {
    var field = document.createElement("div");
    field.className = "field ds-lead-field";
    var label = document.createElement("label");
    label.htmlFor = id;
    label.textContent = labelText + (required ? " *" : "");
    var input = document.createElement(type === "select" ? "div" : "input");
    if (type === "select") {
      input = makeTreatmentSelect(id, form.getAttribute("data-treatment-prefill-id"));
    } else {
      input.type = type;
      input.id = id;
      input.name = name;
      if (required) input.required = true;
      if (autocomplete) input.autocomplete = autocomplete;
      if (type === "tel") {
        input.inputMode = "tel";
        input.placeholder = "+91 98115 04048";
      }
      if (type === "text" && name === "name") {
        input.minLength = 2;
        input.maxLength = 80;
        input.placeholder = "Your name";
      }
    }
    field.appendChild(label);
    field.appendChild(input);
    form.appendChild(field);
    return input;
  }

  function addRadioChoice(form, id, name, value, labelText) {
    var label = document.createElement("label");
    label.className = "ds-radio-choice";
    var input = document.createElement("input");
    input.type = "radio";
    input.name = name;
    input.value = value;
    input.id = id;
    label.appendChild(input);
    label.appendChild(document.createTextNode(" " + labelText));
    form.appendChild(label);
  }

  function buildForm(form, index, treatmentId) {
    var isQuick = form.getAttribute("data-form-type") === "quick" ||
      form.classList.contains("hero-quick-form") || form.id === "heroForm";
    var formType = isQuick ? "quick_enquiry" : "detailed_consultation";
    var prefill = TREATMENT_LABELS[form.getAttribute("data-service")] ?
      form.getAttribute("data-service") : treatmentId;
    if (!TREATMENT_LABELS[prefill]) prefill = "not-sure";
    form.setAttribute("data-form-type", formType);
    form.setAttribute("data-treatment-id", treatmentId);
    form.setAttribute("data-treatment-prefill-id", prefill);
    form.setAttribute("data-form-location",
      form.closest(".consult-modal") ? "modal" :
        /contact\.html?$/i.test(pagePath()) ? "contact_page" :
          (pagePath() === "/" || /index\.html?$/i.test(pagePath())) && isQuick ? "home_hero" : "inline");
    form.setAttribute("method", "post");
    form.setAttribute("novalidate", "");

    var prefix = "dslead_" + index;
    var existingTrap = form.querySelector('[name="website"],[name="_hp"]');
    form.replaceChildren();

    if (!form.closest(".consult-modal")) {
      var title = document.createElement("h3");
      title.textContent = isQuick ? "Quick Enquiry" : "Request an appointment";
      form.appendChild(title);
    }
    var intro = document.createElement("p");
    intro.className = "ds-lead-intro";
    intro.textContent = "We will contact you within clinic hours (Mon-Sat, 10 AM-6 PM).";
    form.appendChild(intro);

    addField(form, "Full name", "name", "text", prefix + "_name", true, "name");
    var phone = addField(form, "Phone number", "phone", "tel", prefix + "_phone", true, "tel");
    phone.maxLength = 20;
    addField(form, "Treatment of interest", "treatment_id", "select", prefix + "_treatment", true);

    if (!isQuick) {
      var date = addField(form, "Preferred appointment date", "appointment_date", "date", prefix + "_date", false);
      var today = new Date();
      var localDate = new Date(today.getTime() - today.getTimezoneOffset() * 60000).toISOString().slice(0, 10);
      var maxDate = new Date(today.getTime() - today.getTimezoneOffset() * 60000 + 90 * 86400000).toISOString().slice(0, 10);
      date.min = localDate;
      date.max = maxDate;

      var sundayNotice = document.createElement("p");
      sundayNotice.className = "ds-sunday-notice";
      sundayNotice.hidden = true;
      sundayNotice.textContent = "The clinic is closed on Sundays. We’ll help find another suitable time.";
      form.appendChild(sundayNotice);
      date.addEventListener("change", function () {
        sundayNotice.hidden = !date.value || new Date(date.value + "T00:00:00").getDay() !== 0;
      });

      var methodLegend = document.createElement("fieldset");
      methodLegend.className = "ds-contact-method";
      methodLegend.innerHTML = "<legend>Preferred contact method (optional)</legend>";
      form.appendChild(methodLegend);
      addRadioChoice(methodLegend, prefix + "_phone_call", "contact_method", "phone_call", "Phone call");
      addRadioChoice(methodLegend, prefix + "_whatsapp", "contact_method", "whatsapp", "WhatsApp");

      var time = document.createElement("div");
      time.className = "field ds-lead-field";
      time.innerHTML = '<label for="' + prefix + '_time">Preferred time (optional)</label>';
      var timeSelect = document.createElement("select");
      timeSelect.id = prefix + "_time";
      timeSelect.name = "preferred_time";
      timeSelect.innerHTML = '<option value="">No preference</option><option value="Morning">Morning</option><option value="Afternoon">Afternoon</option><option value="Evening">Evening</option>';
      time.appendChild(timeSelect);
      form.appendChild(time);

      var concern = document.createElement("div");
      concern.className = "field ds-lead-field";
      concern.innerHTML = '<label for="' + prefix + '_concern">Specific concern (optional)</label>';
      var textarea = document.createElement("textarea");
      textarea.id = prefix + "_concern";
      textarea.name = "concern";
      textarea.rows = 3;
      textarea.maxLength = 1000;
      concern.appendChild(textarea);
      form.appendChild(concern);
    }

    var consentField = document.createElement("div");
    consentField.className = "field ds-lead-field";
    var consentLabel = document.createElement("label");
    consentLabel.className = "lead-consent";
    consentLabel.htmlFor = prefix + "_consent";
    var consent = document.createElement("input");
    consent.type = "checkbox";
    consent.id = prefix + "_consent";
    consent.name = "consent";
    consent.required = true;
    consentLabel.appendChild(consent);
    consentLabel.appendChild(document.createTextNode(
      " I agree that Dental Specialities may use my details to respond to this enquiry. "
    ));
    var consentLink = document.createElement("a");
    consentLink.href = "privacy-policy.html";
    consentLink.textContent = "Privacy policy";
    consentLabel.appendChild(consentLink);
    consentField.appendChild(consentLabel);
    form.appendChild(consentField);

    var honeypot = document.createElement("div");
    honeypot.className = "ds-honeypot";
    honeypot.setAttribute("aria-hidden", "true");
    honeypot.innerHTML = '<label>Leave this field empty<input type="text" name="website" tabindex="-1" autocomplete="off"></label>';
    form.appendChild(honeypot);
    if (existingTrap && existingTrap.value) {
      honeypot.querySelector("input").value = existingTrap.value;
    }

    var errorSummary = document.createElement("p");
    errorSummary.className = "ds-form-status";
    errorSummary.setAttribute("role", "status");
    errorSummary.setAttribute("aria-live", "polite");
    errorSummary.tabIndex = -1;
    form.appendChild(errorSummary);

    var button = document.createElement("button");
    button.type = "submit";
    button.className = "btn btn-primary wa-submit";
    button.textContent = isQuick ? "Send enquiry" : "Request appointment";
    form.appendChild(button);

    var privacy = document.createElement("p");
    privacy.className = "privacy-note";
    privacy.appendChild(document.createTextNode("We will only use your details to contact you about your appointment. "));
    var privacyLink = document.createElement("a");
    privacyLink.href = "privacy-policy.html";
    privacyLink.textContent = "Privacy policy";
    privacy.appendChild(privacyLink);
    form.appendChild(privacy);
  }

  function clearFieldError(field) {
    if (!field || !field.hasAttribute("aria-invalid")) return;
    field.removeAttribute("aria-invalid");
    var error = field.parentNode.querySelector(".ds-field-error");
    if (error) error.remove();
    var describedBy = (field.getAttribute("aria-describedby") || "").split(/\s+/).filter(function (id) {
      return id && !/ds_error$/.test(id);
    });
    if (describedBy.length) field.setAttribute("aria-describedby", describedBy.join(" "));
    else field.removeAttribute("aria-describedby");
  }

  function clearErrors(form) {
    form.querySelectorAll("[aria-invalid='true']").forEach(clearFieldError);
  }

  function showFieldError(field, text) {
    var errorId = field.id + "_ds_error";
    var error = document.getElementById(errorId);
    if (!error) {
      error = document.createElement("span");
      error.id = errorId;
      error.className = "ds-field-error";
      field.parentNode.appendChild(error);
    }
    error.textContent = text;
    field.setAttribute("aria-invalid", "true");
    field.setAttribute("aria-describedby", errorId);
  }

  function normalizedPhone(value) {
    if (!/^[+\d\s().-]+$/.test(value)) return "";
    var digits = value.replace(/\D/g, "");
    if (digits.indexOf("0091") === 0 && digits.length === 14) digits = digits.slice(4);
    else if (digits.indexOf("91") === 0 && digits.length === 12) digits = digits.slice(2);
    else if (digits.indexOf("0") === 0 && digits.length === 11) digits = digits.slice(1);
    return /^[6-9]\d{9}$/.test(digits) ? "+91" + digits : "";
  }

  function validate(form) {
    clearErrors(form);
    var name = form.querySelector('[name="name"]');
    var phone = form.querySelector('[name="phone"]');
    var treatment = form.querySelector('[name="treatment_id"]');
    var date = form.querySelector('[name="appointment_date"]');
    var consent = form.querySelector('[name="consent"]');
    var invalid = [];
    var trimmedName = name.value.trim();
    if (trimmedName.length < 2 || trimmedName.length > 80 || !/\p{L}/u.test(trimmedName)) {
      invalid.push([name, "Enter a name of 2–80 characters that includes a letter."]);
    }
    if (!normalizedPhone(phone.value.trim())) {
      invalid.push([phone, "Enter a valid Indian mobile number (10 digits starting with 6–9)."]);
    }
    if (!treatment.value || !TREATMENT_LABELS[treatment.value]) {
      invalid.push([treatment, "Choose a treatment of interest."]);
    }
    if (!consent.checked) {
      invalid.push([consent, "Please agree to the privacy notice before submitting."]);
    }
    if (date && date.value && (date.value < date.min || date.value > date.max)) {
      invalid.push([date, "Choose a date within the next 90 days."]);
    }
    if (invalid.length) {
      invalid.forEach(function (item) { showFieldError(item[0], item[1]); });
      var summary = form.querySelector(".ds-form-status");
      summary.textContent = "Please correct the highlighted fields.";
      invalid[0][0].focus();
      return false;
    }
    return true;
  }

  function initialize() {
    var treatmentId = currentTreatment();
    document.body.setAttribute("data-treatment-id", treatmentId);
    firstTouch();
    setupCtas(treatmentId);

    var forms = document.querySelectorAll("form[data-wa]");
    Array.prototype.forEach.call(forms, function (form, index) {
      buildForm(form, index + 1, treatmentId);
      form.addEventListener("focusin", function () {
        if (form.getAttribute("data-open-tracked")) return;
        form.setAttribute("data-open-tracked", "true");
        pushEvent("lead_form_open", {
          form_type: form.getAttribute("data-form-type"),
          treatment_id: treatmentId,
          page_path: pagePath()
        });
      });
    });

    var modal = document.getElementById("consultModal");
    var detailedForm = document.querySelector('form[data-form-type="detailed_consultation"]');
    if (!modal && detailedForm && !document.querySelector(".booking-inline-section, .book-form")) {
      modal = document.createElement("div");
      modal.id = "dsLeadConsultModal";
      modal.className = "consult-modal";
      modal.setAttribute("role", "dialog");
      modal.setAttribute("aria-modal", "true");
      modal.setAttribute("aria-labelledby", "dsLeadModalTitle");
      modal.innerHTML =
        '<div class="modal-backdrop"></div><div class="modal-dialog glass">' +
        '<button type="button" class="modal-close" aria-label="Close appointment form">×</button>' +
        '<div class="modal-body"><h2 id="dsLeadModalTitle">Request an appointment</h2></div></div>';
      var modalForm = detailedForm.cloneNode(true);
      modalForm.id = "";
      modalForm.removeAttribute("data-open-tracked");
      modal.querySelector(".modal-body").appendChild(modalForm);
      buildForm(modalForm, "modal", treatmentId);
      modalForm.addEventListener("focusin", function () {
        if (modalForm.getAttribute("data-open-tracked")) return;
        modalForm.setAttribute("data-open-tracked", "true");
        pushEvent("lead_form_open", {
          form_type: modalForm.getAttribute("data-form-type"),
          treatment_id: treatmentId,
          page_path: pagePath()
        });
      });
      document.body.appendChild(modal);
    }

    if (modal) {
      var lastModalTrigger = null;
      function closeModal() {
        modal.classList.remove("open");
        document.body.style.overflow = "";
        if (lastModalTrigger && lastModalTrigger.isConnected && lastModalTrigger.focus) {
          var trigger = lastModalTrigger;
          window.setTimeout(function () { trigger.focus({ preventScroll: true }); }, 0);
        }
      }
      document.addEventListener("click", function (event) {
        var trigger = event.target.closest && event.target.closest(
          '.trigger-consult-modal,.trigger-book-modal,[data-modal="consultation"],a[href="#book"],a[href="contact.html#book"],a[href="contact.html#book-consultation"]'
        );
        if (trigger && !trigger.closest("form")) {
          event.preventDefault();
          event.stopImmediatePropagation();
          lastModalTrigger = trigger;
          modal.classList.add("open");
          document.body.style.overflow = "hidden";
          var modalForm = modal.querySelector("form[data-wa]");
          if (modalForm && !modalForm.getAttribute("data-open-tracked")) {
            modalForm.setAttribute("data-open-tracked", "true");
            pushEvent("lead_form_open", {
              form_type: modalForm.getAttribute("data-form-type"),
              treatment_id: treatmentId,
              page_path: pagePath()
            });
          }
          var firstInput = modal.querySelector("input:not([type=hidden]),select,textarea");
          if (firstInput) firstInput.focus();
          return;
        }
        if (event.target.closest && event.target.closest(".modal-close")) {
          event.preventDefault();
          event.stopImmediatePropagation();
          closeModal();
        } else if (event.target === modal.querySelector(".modal-backdrop")) {
          event.stopImmediatePropagation();
          closeModal();
        }
      }, true);
      document.addEventListener("keydown", function (event) {
        if (!modal.classList.contains("open")) return;
        if (event.key === "Escape") {
          closeModal();
          return;
        }
        if (event.key !== "Tab") return;
        var focusable = Array.prototype.slice.call(modal.querySelectorAll(
          'a[href],button:not([disabled]),input:not([disabled]),select:not([disabled]),textarea:not([disabled]),[tabindex]:not([tabindex="-1"])'
        ));
        if (!focusable.length) return;
        var first = focusable[0];
        var last = focusable[focusable.length - 1];
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first.focus();
        }
      });
    }
  }

  document.addEventListener("submit", function (event) {
    var form = event.target;
    if (!form || !form.matches || !form.matches("form[data-wa]")) return;
    event.preventDefault();
    event.stopImmediatePropagation();

    var honeypot = form.querySelector('[name="website"]');
    if (honeypot && honeypot.value) return;
    if (!validate(form)) return;

    var treatment = form.querySelector('[name="treatment_id"]').value;
    var formType = form.getAttribute("data-form-type");
    var name = form.querySelector('[name="name"]').value.trim();
    var phone = normalizedPhone(form.querySelector('[name="phone"]').value.trim());
    var enhanced = { phone_number: phone };
    var date = form.querySelector('[name="appointment_date"]');
    var time = form.querySelector('[name="preferred_time"]');
    var concern = form.querySelector('[name="concern"]');
    var contact = form.querySelector('[name="contact_method"]:checked');
    var leadId = window.crypto && window.crypto.randomUUID
      ? window.crypto.randomUUID()
      : Date.now().toString(36) + "-" + Math.random().toString(36).slice(2, 12);
    var messageParts = [];
    if (date && date.value) messageParts.push("Preferred appointment date: " + date.value);
    if (contact) messageParts.push("Preferred contact method: " +
      (contact.value === "phone_call" ? "Phone call" : "WhatsApp"));
    if (concern && concern.value.trim()) messageParts.push(concern.value.trim());
    var payload = {
      lead_id: leadId,
      name: name,
      phone: phone,
      treatmentInterest: TREATMENT_LABELS[treatment],
      preferred_time: time ? time.value : "",
      message: messageParts.join("\n"),
      consent: form.querySelector('[name="consent"]').checked,
      website: honeypot ? honeypot.value : "",
      source_page: window.location.pathname,
      page_url: window.location.pathname,
      source: formType === "quick_enquiry"
        ? "Website callback request"
        : "Website consultation request"
    };
    pushEvent("lead_form_submit_attempt", {
      form_type: formType,
      treatment_id: treatment
    });

    var submitButton = form.querySelector('button[type="submit"]');
    var status = form.querySelector(".ds-form-status");
    var buttonText = submitButton ? submitButton.textContent : "";
    if (submitButton) {
      submitButton.disabled = true;
      submitButton.textContent = "Saving enquiry…";
    }
    status.textContent = "Saving your enquiry securely…";

    fetch(window.LEAD_ENDPOINT || "/api/public/queries", {
      method: "POST",
      credentials: "same-origin",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    }).then(function (response) {
      return response.json().catch(function () {
        throw new Error("The lead server returned an invalid response.");
      }).then(function (result) {
        if (!response.ok || !result.success) {
          throw new Error(result.message || "Unable to save your enquiry.");
        }
      });
    }).then(function () {
      try {
        window.sessionStorage.setItem("ds_lead", JSON.stringify({
          lead_id: leadId,
          type: formType,
          service: form.getAttribute("data-service") || treatment,
          treatment_id: treatment,
          form_page_path: window.location.pathname,
          enhanced_conversion_data: enhanced
        }));
      } catch (error) {
        console.error("Unable to save the enquiry success record.", error);
      }
      window.location.assign("/thank-you.html?treatment=" + encodeURIComponent(treatment));
    }).catch(function (error) {
      console.error("Lead delivery request failed.", error);
      status.textContent = "We could not save your enquiry right now. Please try again or call us at +91 98115 04048.";
      status.focus();
      if (submitButton) {
        submitButton.disabled = false;
        submitButton.textContent = buttonText;
      }
    });
  }, true);

  document.addEventListener("input", function (event) {
    var form = event.target.closest && event.target.closest("form[data-wa]");
    if (!form) return;
    clearFieldError(event.target);
    var status = form.querySelector(".ds-form-status");
    if (status && /correct the highlighted fields/.test(status.textContent)) status.textContent = "";
  });
  document.addEventListener("change", function (event) {
    var form = event.target.closest && event.target.closest("form[data-wa]");
    if (!form) return;
    clearFieldError(event.target);
  });

  if (document.readyState === "loading" || document.readyState === "interactive") {
    document.addEventListener("DOMContentLoaded", initialize, { once: true });
  } else {
    initialize();
  }
}());
