package com.tuempresa.vehiculos.repositories;

import com.tuempresa.vehiculos.models.Category;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CategoryRepository extends JpaRepository<Category, Long> {
}