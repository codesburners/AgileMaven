package com.baba.AgileBankingSystem.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class StatusChange {
    private String timestamp;
    private String fromStatus;
    private String toStatus;
    private String changedBy;
    private String reason;
}
