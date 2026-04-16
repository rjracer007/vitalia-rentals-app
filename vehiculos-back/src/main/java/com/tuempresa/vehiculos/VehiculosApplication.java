package com.tuempresa.vehiculos;

import com.tuempresa.vehiculos.models.Vehicle;
import com.tuempresa.vehiculos.repositories.VehicleRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;

import java.math.BigDecimal;

@SpringBootApplication
public class VehiculosApplication {

	public static void main(String[] args) {
		SpringApplication.run(VehiculosApplication.class, args);
	}

	// Este Bean se ejecuta automáticamente después de que la aplicación arranca
	@Bean
	public CommandLineRunner initData(VehicleRepository vehicleRepository) {
		return args -> {
			// Solo insertamos si la base de datos está vacía
			if (vehicleRepository.count() == 0) {
				vehicleRepository.save(new Vehicle(
						"Tesla Model 3",
						"Auto eléctrico premium con autonomía extendida y piloto automático. Ideal para la ciudad y rutas.",
						new BigDecimal("120.00"),
						"https://images.unsplash.com/photo-1560958089-b8a1929cea89?w=600&q=80"));
				vehicleRepository.save(new Vehicle(
						"BMW Serie 4",
						"Coupé deportivo con diseño elegante y alto rendimiento en carretera.",
						new BigDecimal("150.00"),
						"https://images.unsplash.com/photo-1580273916550-e323be2ae537?w=600&q=80"));
				vehicleRepository.save(new Vehicle(
						"Audi Q5",
						"SUV de lujo, espaciosa, segura y perfecta para viajes familiares largos con máxima comodidad.",
						new BigDecimal("135.00"),
						"https://images.unsplash.com/photo-1603584173870-7f23fdae1b7a?w=600&q=80"));
			}
		};
	}
}