package com.enviro.assessment.junior.cherlton.service;

import com.enviro.assessment.junior.cherlton.dto.AdminMetricsDTO;
import com.enviro.assessment.junior.cherlton.dto.ProductDTO;

public interface AdminService {
    AdminMetricsDTO getMetrics();
    ProductDTO createProduct(ProductDTO productDTO);
}
