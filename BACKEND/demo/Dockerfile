# Step 1: Use Java 17 runtime
FROM eclipse-temurin:21-jre-alpine

WORKDIR /app

COPY target/*.jar app.jar
COPY .env.properties .env.properties

EXPOSE 8090

ENTRYPOINT ["java", "-jar", "app.jar"]


# Step 2: Set working directory inside container
WORKDIR /app

# Step 3: Copy JAR from target folder
COPY target/*.jar app.jar

# Step 4: Expose Spring Boot port
EXPOSE 8090

# Step 5: Run the application
ENTRYPOINT ["java", "-jar", "app.jar"]
