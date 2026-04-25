package com.tuempresa.vehiculos.services;

import com.tuempresa.vehiculos.exceptions.ResourceNotFoundException;
import com.tuempresa.vehiculos.models.Feature;
import com.tuempresa.vehiculos.repositories.FeatureRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class FeatureService {

    @Autowired
    private FeatureRepository featureRepository;

    public List<Feature> getAllFeatures() {
        return featureRepository.findAll();
    }

    public Feature createFeature(Feature feature) {
        return featureRepository.save(feature);
    }

    public Feature updateFeature(Long id, Feature featureDetails) {
        Feature feature = featureRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Característica no encontrada"));

        feature.setName(featureDetails.getName());
        feature.setIcon(featureDetails.getIcon());

        return featureRepository.save(feature);
    }

    public void deleteFeature(Long id) {
        Feature feature = featureRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Característica no encontrada"));
        featureRepository.delete(feature);
    }
}