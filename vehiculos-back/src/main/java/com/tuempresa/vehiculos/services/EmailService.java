package com.tuempresa.vehiculos.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    @Autowired
    private JavaMailSender mailSender;

    public void sendReservationEmail(String toEmail, String userName, String vehicleName, String startDate,
            String endDate) {
        SimpleMailMessage message = new SimpleMailMessage();

        // El correo al que enviaremos (El del usuario)
        message.setTo(toEmail);

        // Asunto del correo
        message.setSubject("¡Reserva Confirmada en Vitalia Rentals!");

        // Cuerpo del correo (US #35)
        String body = "Hola " + userName + ",\n\n" +
                "¡Gracias por confiar en Vitalia Rentals! Tu reserva ha sido confirmada con éxito.\n\n" +
                "Detalles de tu viaje:\n" +
                "- Vehículo: " + vehicleName + "\n" +
                "- Fecha de recogida: " + startDate + "\n" +
                "- Fecha de devolución: " + endDate + "\n\n" +
                "Si tienes alguna duda, puedes contactarnos a través de nuestro WhatsApp en el sitio web.\n\n" +
                "¡Que tengas un excelente viaje!\n" +
                "El equipo de Vitalia Rentals.";

        message.setText(body);

        // ¡Enviamos el correo!
        mailSender.send(message);
    }
}