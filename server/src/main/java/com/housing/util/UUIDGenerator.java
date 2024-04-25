package com.housing.util;

import java.util.UUID;

public class UUIDGenerator {

    public static Long generateLongUUID() {
        UUID uuid = UUID.randomUUID();
        long mostSignificantBits = uuid.getMostSignificantBits();
        long leastSignificantBits = uuid.getLeastSignificantBits();
        long combinedUUID = mostSignificantBits ^ leastSignificantBits;
        return Math.abs(combinedUUID);
    }
}