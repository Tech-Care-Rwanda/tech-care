package com.TechCare.TechCare_Rwanda.configuration;

public class JwtConstant {
    public static final String SECRET_KEY = System.getenv("JWT_SECRET_KEY") != null 
        ? System.getenv("JWT_SECRET_KEY") 
        : "sddkshladhalddlanldaldnadlandlndladnaldandlndlasdnldnsldsndshdshdskdsgs isg";
    public static final String JWT_HEADER = "Authorization";
}
