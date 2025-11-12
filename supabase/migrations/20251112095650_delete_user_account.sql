-- Eliminar completamente la cuenta de un usuario
CREATE OR REPLACE FUNCTION delete_user_account()
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    deleted_user_id uuid;
BEGIN
    -- Obtener ID del usuario actual
    deleted_user_id := auth.uid();

    -- Verificar que hay usuario autenticado
    IF deleted_user_id IS NULL THEN
        RETURN json_build_object(
            'success', false,
            'message', 'No hay usuario autenticado.'
        );
    END IF;
    
    -- Eliminar perfil del usuario
    DELETE FROM public.profiles WHERE id = deleted_user_id;

    -- Eliminar usuario de auth.users
    DELETE FROM auth.users WHERE id = deleted_user_id;

    -- Retornar mensaje de éxito
    RETURN json_build_object(
        'success', true,
        'message', 'Cuenta de usuario eliminada exitosamente.'
    );

EXCEPTION WHEN OTHERS THEN
    -- mANEJO DE errores
    RETURN json_build_object(
        'success', false,
        'message', 'Error al intentar eliminar la cuenta: ' || SQLERRM
    );
END;
$$;

-- Permisos a usuarios autenticados para ejecutar la función
GRANT EXECUTE ON FUNCTION delete_user_account() TO authenticated;

-- Comentario para doc
COMMENT ON FUNCTION delete_user_account() IS 'Elimina completamente la cuenta del usuario autenticado, incluyendo su perfil y datos de autenticación.';