// Função para enviar o formulário e exibir uma mensagem de resposta
document.getElementById('contactForm').addEventListener('submit', function(event) {
    event.preventDefault(); // Impede o envio do formulário e recarregamento da página

    // Obtém os valores dos campos do formulário
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const message = document.getElementById('message').value;

    // Exibe uma mensagem de sucesso (simulando envio de dados)
    const responseMessage = `Obrigado, ${name}! Sua mensagem foi enviada com sucesso.
     Em breve entraremos em contato com você através do e-mail: ${email}.`;
    document.getElementById('responseMessage').innerText = responseMessage;

    // Limpa o formulário após o envio
    document.getElementById('contactForm').reset();
});
