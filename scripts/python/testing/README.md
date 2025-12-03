# Testing Scripts

Scripts for testing various application features and functionality.

## Scripts

### `test_calendar_integration.py`
- **Purpose**: Test calendar integration functionality
- **Usage**: `python scripts/python/testing/test_calendar_integration.py`
- **Description**: Verifies calendar event fields and integration work correctly

### `test_frontend_booking.py`
- **Purpose**: Test frontend booking functionality
- **Usage**: `python scripts/python/testing/test_frontend_booking.py`
- **Description**: Simulates browser booking requests to test CORS and API functionality

## Test Types

- **Integration Tests**: Test complete workflows and API interactions
- **Feature Tests**: Test specific features like calendar integration
- **CORS Tests**: Validate cross-origin requests work correctly
- **API Tests**: Verify API endpoints respond correctly

## Running Tests

Tests are designed to:
- Not interfere with production data
- Clean up after themselves
- Provide detailed output for debugging
- Test real-world scenarios

## Dependencies

Tests require:
- Active database connection
- Proper environment configuration
- Network access for frontend tests