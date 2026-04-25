package com.tuempresa.vehiculos.controllers;

import com.tuempresa.vehiculos.models.Feature;
import com.tuempresa.vehiculos.services.FeatureService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/features")
@CrossOrigin(origins = "http://localhost:5173")
public class FeatureController {

    @Autowired
    private FeatureService featureService;

    @GetMapping
    public ResponseEntity<List<Feature>> getAllFeatures() {
        return ResponseEntity.ok(featureService.getAllFeatures());
    }

    @PostMapping
    public ResponseEntity<Feature> createFeature(@RequestBody Feature feature) {
        return ResponseEntity.ok(featureService.createFeature(feature));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Feature> updateFeature(@PathVariable Long id, @RequestBody Feature feature) {
        return ResponseEntity.ok(featureService.updateFeature(id, feature));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteFeature(@PathVariable Long id) {
        featureService.deleteFeature(id);
        return ResponseEntity.noContent().build();
    }
}