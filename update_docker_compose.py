import yaml

with open('docker-compose.yml', 'r') as f:
    compose = yaml.safe_load(f)

services = compose.get('services', {})

# Ensure ports for product-catalog-service
if 'product-catalog-service' in services:
    if 'ports' not in services['product-catalog-service']:
        services['product-catalog-service']['ports'] = ['8082:8082']

# Ensure EUREKA_HOST and EUREKA_PORT for all Java services
java_services = ['api-gateway', 'auth-service', 'product-catalog-service', 'warehouse-service', 'supplier-service', 'inventory-service', 'order-service']

for svc in java_services:
    if svc in services:
        env = services[svc].get('environment', {})
        if isinstance(env, dict):
            env['EUREKA_HOST'] = 'discovery-server'
            env['EUREKA_PORT'] = '8761'
            # Remove legacy EUREKA_CLIENT_SERVICEURL_DEFAULTZONE if it exists
            env.pop('EUREKA_CLIENT_SERVICEURL_DEFAULTZONE', None)
        elif isinstance(env, list):
            # Convert list of 'K=V' to dict
            env_dict = {}
            for item in env:
                k, v = item.split('=', 1) if '=' in item else (item, '')
                env_dict[k] = v
            env_dict['EUREKA_HOST'] = 'discovery-server'
            env_dict['EUREKA_PORT'] = '8761'
            env_dict.pop('EUREKA_CLIENT_SERVICEURL_DEFAULTZONE', None)
            env = [f"{k}={v}" for k, v in env_dict.items()]
        services[svc]['environment'] = env

with open('docker-compose.yml', 'w') as f:
    yaml.dump(compose, f, sort_keys=False, default_flow_style=False)
