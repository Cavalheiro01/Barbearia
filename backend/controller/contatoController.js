/*-------- INICIALIZAR EMAILJS --------*/
if (typeof emailjs !== "undefined") {
    (function () {
        emailjs.init("kUv_yHpV4D9T1PQNv");
    })();
}

/*-------- ENVIO DO FORMULÁRIO DE CONTATO --------*/
const formContato = document.getElementById("contact-form");
const feedbackMsg = document.getElementById("feedback");

if (formContato && feedbackMsg) {

    formContato.addEventListener("submit", function (event) {
        event.preventDefault();

        const btn = this.querySelector("button");
        btn.innerText = "Enviando...";
        btn.disabled = true;

        feedbackMsg.style.display = "none";

        const serviceID = "service_l4sd1gl";
        const templateID = "template_qopc7ti";

        emailjs.sendForm(serviceID, templateID, this)
            .then(() => {
                feedbackMsg.innerText = "Mensagem enviada com sucesso!";
                feedbackMsg.style.backgroundColor = "#d4edda";
                feedbackMsg.style.color = "#155724";
                feedbackMsg.style.border = "1px solid #c3e6cb";
                feedbackMsg.style.display = "block";

                formContato.reset();
            })
            .catch((error) => {
                console.error(error);

                feedbackMsg.innerText = "Erro ao enviar mensagem.";
                feedbackMsg.style.backgroundColor = "#f8d7da";
                feedbackMsg.style.color = "#721c24";
                feedbackMsg.style.border = "1px solid #f5c6cb";
                feedbackMsg.style.display = "block";
            })
            .finally(() => {
                btn.innerText = "Enviar Mensagem";
                btn.disabled = false;
            });
    });
}