package com.ozstrategy.webapp.security;

import com.ozstrategy.service.userrole.RoleManager;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.hierarchicalroles.RoleHierarchy;
import org.springframework.security.authentication.AuthenticationTrustResolver;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.AuthorityUtils;
import org.springframework.security.web.FilterInvocation;
import org.springframework.util.StringUtils;

import javax.servlet.http.HttpServletRequest;
import java.net.InetAddress;
import java.net.UnknownHostException;
import java.util.Arrays;
import java.util.Collection;
import java.util.HashSet;
import java.util.Set;


public class WebSecurityExpressionRoot {
  public final boolean denyAll = false;

  public final boolean permitAll = true;

  public HttpServletRequest request;
  private Authentication    authentication;
  private RoleHierarchy     roleHierarchy;

  @Autowired private RoleManager roleManager;
  private Set<String>            roles;

  private AuthenticationTrustResolver trustResolver;

  public WebSecurityExpressionRoot() { }

  public final boolean denyAll() {
    return false;
  }

  public final Authentication getAuthentication() {
    return authentication;
  }

  public Object getPrincipal() {
    return authentication.getPrincipal();
  }

  public final boolean hasAnyFeature(String... features) {
    Set<String> roleSet = getAuthoritySet();

    for (String feature : features) {
      if (roleManager.hasFeature(roleSet, feature)) {
        return true;
      }
    }
    return false;
  }

  public final boolean hasAnyRole(String... roles) {
    Set<String> roleSet = getAuthoritySet();

    for (String role : roles) {
      if (roleSet.contains(role)) {
        return true;
      }
    }
    return false;
  }

  public final boolean hasFeature(String feature) {
    return roleManager.hasFeature(getAuthoritySet(), feature);
  }
  public final boolean authenticatedContext(String context){
    Set<String> roleSet = getAuthoritySet();
    return roleManager.authenticatedContext(roleSet,context);
  }
  public boolean hasIpAddress(String ipAddress) {
    int nMaskBits = 0;

    if (ipAddress.indexOf('/') > 0) {
      String[] addressAndMask = StringUtils.split(ipAddress, "/");
      ipAddress = addressAndMask[0];
      nMaskBits = Integer.parseInt(addressAndMask[1]);
    }

    InetAddress requiredAddress = parseAddress(ipAddress);
    InetAddress remoteAddress   = parseAddress(request.getRemoteAddr());

    if (!requiredAddress.getClass().equals(remoteAddress.getClass())) {
      throw new IllegalArgumentException(
        "IP Address in expression must be the same type as "
        + "version returned by request");
    }

    if (nMaskBits == 0) {
      return remoteAddress.equals(requiredAddress);
    }

    byte[] remAddr = remoteAddress.getAddress();
    byte[] reqAddr = requiredAddress.getAddress();

    int    oddBits    = nMaskBits % 8;
    int    nMaskBytes = (nMaskBits / 8) + ((oddBits == 0) ? 0 : 1);
    byte[] mask       = new byte[nMaskBytes];

    Arrays.fill(mask, 0, (oddBits == 0) ? mask.length : (mask.length - 1), (byte) 0xFF);

    if (oddBits != 0) {
      int finalByte = (1 << oddBits) - 1;
      finalByte             <<= 8 - oddBits;
      mask[mask.length - 1] = (byte) finalByte;
    }

    // System.out.println("Mask is " + new sun.misc.HexDumpEncoder().encode(mask));

    for (int i = 0; i < mask.length; i++) {
      if ((remAddr[i] & mask[i]) != (reqAddr[i] & mask[i])) {
        return false;
      }
    }

    return true;
  } 

  public final boolean hasRole(String role) {
    return getAuthoritySet().contains(role);
  }

  public void init(Authentication a, FilterInvocation fi) {
    if (a == null) {
      throw new IllegalArgumentException(
        "Authentication object cannot be null");
    }

    this.authentication = a;

    this.request = fi.getRequest();
  }

  public final boolean isAnonymous() {
    return trustResolver.isAnonymous(authentication);
  }

  public final boolean isAuthenticated() {
    return !isAnonymous();
  }

  public final boolean isFullyAuthenticated() {
    return !trustResolver.isAnonymous(authentication)
      && !trustResolver.isRememberMe(authentication);
  }

  public final boolean isRememberMe() {
    return trustResolver.isRememberMe(authentication);
  }

  public final boolean permitAll() {
    return true;
  }

  public void setRoleHierarchy(RoleHierarchy roleHierarchy) {
    this.roleHierarchy = roleHierarchy;
  }

  public void setRoleManager(RoleManager roleManager) {
    this.roleManager = roleManager;
  }

  public void setTrustResolver(AuthenticationTrustResolver trustResolver) {
    this.trustResolver = trustResolver;
  }


  private Set<String> getAuthoritySet() {
// if (roles == null) {
    roles = new HashSet<String>();

    Collection<GrantedAuthority> userAuthorities = (Collection<GrantedAuthority>) authentication.getAuthorities();

    if (roleHierarchy != null) {
      userAuthorities = (Collection<GrantedAuthority>) roleHierarchy.getReachableGrantedAuthorities(userAuthorities);
    }

    roles = AuthorityUtils.authorityListToSet(userAuthorities);
// }

    return roles;
  }

  private InetAddress parseAddress(String address) {
    try {
      return InetAddress.getByName(address);
    } catch (UnknownHostException e) {
      throw new IllegalArgumentException("Failed to parse address"
        + address, e);
    }
  }


} // end class WebSecurityExpressionRoot
