package com.baba.AgileBankingSystem.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class Document {
    private String id;
    private String type;
    private String fileName;
    private String uploadDate;
    private String status;
}
